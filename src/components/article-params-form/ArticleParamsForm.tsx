import { useState, useEffect, useRef, FormEvent, useCallback } from 'react';
import { ArrowButton } from 'src/ui/arrow-button';
import { Button } from 'src/ui/button';
import { Text } from 'src/ui/text/Text';
import { Select } from 'src/ui/select/Select';
import { RadioGroup } from 'src/ui/radio-group/RadioGroup';
import { Separator } from 'src/ui/separator';
import {
	ArticleStateType,
	fontFamilyOptions,
	fontSizeOptions,
	fontColors,
	backgroundColors,
	contentWidthArr,
} from 'src/constants/articleProps';
import clsx from 'clsx';

import styles from './ArticleParamsForm.module.scss';

type Props = {
	initialState: ArticleStateType;
	onApply: (state: ArticleStateType) => void;
};

export const ArticleParamsForm = ({ initialState, onApply }: Props) => {
	const [formState, setFormState] = useState(initialState);

	const updateFormState = (updates: Partial<ArticleStateType>) => {
		setFormState((prev) => ({ ...prev, ...updates }));
	};

	const handleSubmit = useCallback(
		(event: FormEvent) => {
			event.preventDefault();
			onApply(formState);
			setIsOpenAside(false);
		},
		[formState, onApply]
	);

	const handleReset = useCallback(
		(event: FormEvent) => {
			event.preventDefault();
			onApply(initialState);
			setFormState(initialState);
			setIsOpenAside(false);
		},
		[initialState, onApply]
	);

	/*Реализация сайдбара*/
	const [isOpenAside, setIsOpenAside] = useState(false);
	const asideRef = useRef<HTMLElement>(null);

	const asideStyle = clsx({
		[styles.container]: true,
		[styles.container_open]: isOpenAside,
	});

	const handleClickArrowBtn = () => {
		setIsOpenAside((previsOpenAside) => !previsOpenAside);
	};

	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			if (
				asideRef.current &&
				!asideRef.current.contains(event.target as Node)
			) {
				setIsOpenAside(false);
			}
		}

		if (isOpenAside) {
			document.addEventListener('mousedown', handleClickOutside);
			return () =>
				document.removeEventListener('mousedown', handleClickOutside);
		}
	}, [isOpenAside]);

	return (
		<>
			<ArrowButton isOpen={isOpenAside} onClick={handleClickArrowBtn} />
			<aside className={asideStyle} ref={asideRef}>
				<form
					className={styles.form}
					onReset={handleReset}
					onSubmit={handleSubmit}>
					<Text as='h1' size={31} weight={800} uppercase={true}>
						Задайте параметры
					</Text>
					<Select
						title='шрифт'
						options={fontFamilyOptions}
						selected={formState.fontFamilyOption}
						onChange={(selected) =>
							updateFormState({ fontFamilyOption: selected })
						}
					/>
					<RadioGroup
						name='fontSize'
						options={fontSizeOptions}
						selected={formState.fontSizeOption}
						title='размер шрифта'
						onChange={(value) => {
							updateFormState({ fontSizeOption: value });
						}}
					/>
					<Select
						title='цвет шрифта'
						options={fontColors}
						selected={formState.fontColor}
						onChange={(selected) => updateFormState({ fontColor: selected })}
					/>
					<Separator />
					<Select
						title='цвет фона'
						options={backgroundColors}
						selected={formState.backgroundColor}
						onChange={(selected) =>
							updateFormState({ backgroundColor: selected })
						}
					/>
					<Select
						title='ширина контента'
						options={contentWidthArr}
						selected={formState.contentWidth}
						onChange={(selected) => updateFormState({ contentWidth: selected })}
					/>
					<div className={styles.bottomContainer}>
						<Button title='Сбросить' htmlType='reset' type='clear' />
						<Button title='Применить' htmlType='submit' type='apply' />
					</div>
				</form>
			</aside>
		</>
	);
};
